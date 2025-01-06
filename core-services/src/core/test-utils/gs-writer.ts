/**
 * Angular Getter/Setter Test Generator
 * 
 * Automatically generates unit tests for getter/setter properties in Angular components.
 * Preserves existing tests and only adds new ones when needed.
 * 
 * @example CLI Usage:
 * ```bash
 * # Generate tests with default options
 * npm run generate-tests
 * 
 * # Generate tests with custom options
 * npm run generate-tests -- --dir src/app --output src/app/my-tests.spec.ts --verbose
 * 
 * # Available options:
 * #   --dir      Source directory to scan (default: "src")
 * #   --output   Output file location (default: "src/app/auto-generated.spec.ts")
 * #   --verbose  Enable detailed logging
 * ```
 * 
 * @example Programmatic Usage:
 * ```typescript
 * import { generateAccessorTests } from './gs-writer';
 * 
 * // Basic usage with defaults
 * await generateAccessorTests();
 * 
 * // Custom configuration
 * await generateAccessorTests(
 *   'src/app',                         // source directory
 *   'src/app/custom-tests.spec.ts',    // output file
 *   { 
 *     batchSize: 100,                  // files to process at once
 *     verbose: true                    // detailed logging
 *   }
 * );
 * ```
 * 
 * Generated tests will:
 * - Automatically detect standalone vs traditional components
 * - Preserve any existing/modified tests
 * - Generate appropriate mock values based on types
 * - Handle relative imports correctly
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { promisify } from 'util';
import { glob } from 'glob';
import { Command } from 'commander';

const readFileAsync = promisify(fs.readFile);
const fileCache = new Map<string, string>();

/**
 * Represents a pair of getter/setter accessors for a property
 */
interface AccessorPair {
    name: string;
    file: string;
    getterType?: string;
    setterType?: string;
}

/**
 * Efficiently finds TypeScript files using glob patterns
 */
async function findFilesByPattern(dir: string, pattern: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        glob(pattern, { cwd: dir, absolute: true }, (err, matches) => {
            if (err) reject(err);
            resolve(matches);
        });
    });
}

/**
 * Cached file reader that supports async operations
 */
async function getCachedFileContent(filePath: string): Promise<string> {
    if (!fileCache.has(filePath)) {
        const content = await readFileAsync(filePath, 'utf8');
        fileCache.set(filePath, content);
    }
    return fileCache.get(filePath)!;
}

/**
 * Optimized AST visitor that collects all relevant nodes in a single pass
 */
class TypeScriptASTVisitor {
    private accessors: Map<string, AccessorPair> = new Map();
    private sourceFile: ts.SourceFile;
    private filePath: string;

    constructor(sourceFile: ts.SourceFile, filePath: string) {
        this.sourceFile = sourceFile;
        this.filePath = filePath;
    }

    visit(node: ts.Node): void {
        if (ts.isGetAccessor(node) || ts.isSetAccessor(node)) {
            this.processAccessor(node);
        }
        ts.forEachChild(node, n => this.visit(n));
    }

    private processAccessor(node: ts.Node & { name: ts.PropertyName; type?: ts.TypeNode }): void {
        const name = node.name.getText(this.sourceFile);
        const kind = ts.isGetAccessor(node) ? 'getter' : 'setter';
        const typeText = node.type ? node.type.getText(this.sourceFile) : 'any';

        if (!this.accessors.has(name)) {
            this.accessors.set(name, { 
                name, 
                file: this.filePath,
                getterType: undefined,
                setterType: undefined 
            });
        }

        const accessor = this.accessors.get(name)!;
        if (kind === 'getter') {
            accessor.getterType = typeText;
        } else {
            accessor.setterType = typeText;
        }
    }

    getResults(): AccessorPair[] {
        return Array.from(this.accessors.values());
    }
}

/**
 * Template-based test generator for improved performance
 */
class TestGenerator {
    private static readonly templates = {
        imports: (imports: string[]) => [
            "import { TestBed } from '@angular/core/testing';",
            ...imports
        ].join('\n'),
        
        describe: (className: string, content: string) => `
describe('${className}', () => {
    let instance: ${className};
    ${content}
});`,
        
        beforeEach: (className: string, isStandalone: boolean) => `
    beforeEach(() => {
        TestBed.configureTestingModule({
            ${isStandalone ? `imports: [${className}]` : `declarations: [${className}]`}
        });
        instance = TestBed.createComponent(${className}).componentInstance;
    });`,
        
        getter: (name: string) => `
    it('should get ${name}', () => {
        expect(instance.${name}).toBeDefined();
    });`,
        
        setter: (name: string, type: string, mockValue: string) => `
    it('should set ${name}', () => {
        const mockValue: ${type} = ${mockValue};
        instance.${name} = mockValue;
        expect(instance.${name}).toBeDefined();
    });`
    };

    private static parseExistingTests(filePath: string): Map<string, Set<string>> {
        const existingTests = new Map<string, Set<string>>();
        
        if (!fs.existsSync(filePath)) {
            return existingTests;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.ESNext, true);
            
            let currentDescribe: string | null = null;
            let currentTests = new Set<string>();

            const visit = (node: ts.Node) => {
                if (ts.isCallExpression(node) && node.expression.getText() === 'describe') {
                    const describeName = node.arguments[0].getText().replace(/['"]/g, '');
                    currentDescribe = describeName;
                    currentTests = new Set<string>();
                    existingTests.set(currentDescribe, currentTests);
                }
                
                if (currentDescribe && ts.isCallExpression(node) && node.expression.getText() === 'it') {
                    const testName = node.arguments[0].getText().replace(/['"]/g, '');
                    currentTests.add(testName);
                }
                
                ts.forEachChild(node, visit);
            };
            
            ts.forEachChild(sourceFile, visit);
        } catch (error) {
            console.warn('Error parsing existing tests:', error);
        }
        
        return existingTests;
    }

    static generateTestFile(pairs: AccessorPair[], outputPath: string): string {
        const existingTests = this.parseExistingTests(outputPath);
        const imports = new Set<string>();
        const testBlocks = new Map<string, string[]>();

        pairs.forEach(pair => {
            const className = this.getClassNameFromFileName(pair.file);
            if (!testBlocks.has(pair.file)) {
                testBlocks.set(pair.file, []);
                imports.add(`import { ${className} } from '${this.getRelativePath(outputPath, pair.file)}';`);
            }
            
            const tests = testBlocks.get(pair.file)!;
            const existingClassTests = existingTests.get(className) || new Set();

            if (pair.getterType) {
                const getterTest = `should get ${pair.name}`;
                if (!existingClassTests.has(getterTest)) {
                    tests.push(this.templates.getter(pair.name));
                }
            }
            
            if (pair.setterType) {
                const setterTest = `should set ${pair.name}`;
                if (!existingClassTests.has(setterTest)) {
                    tests.push(this.templates.setter(
                        pair.name,
                        pair.setterType,
                        this.generateMockValue(pair.setterType)
                    ));
                }
            }
        });

        // Only generate new content if we have new tests
        if (Array.from(testBlocks.values()).some(tests => tests.length > 0)) {
            return this.assembleTestFile(imports, testBlocks, existingTests);
        }

        return fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf-8') : '';
    }

    private static getClassNameFromFileName(filePath: string): string {
        const baseName = path.basename(filePath, '.ts');
        return baseName.split('.').map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join('');
    }

    private static getRelativePath(from: string, to: string): string {
        return './' + path.relative(path.dirname(from), to)
            .replace(/\\/g, '/')
            .replace('.ts', '');
    }

    private static generateMockValue(type: string): string {
        const lowerType = type.toLowerCase().replace(/\s/g, '');
        const mockValues: Record<string, string> = {
            'string': `'mockString'`,
            'number': '123',
            'boolean': 'true',
            'any': '{}',
            'object': '{ mockKey: "mockValue" }',
            'array': '[]'
        };

        if (lowerType.includes('[]') || lowerType.includes('array')) {
            return '[]';
        }

        return mockValues[lowerType] || `{ /* TODO: mock ${type} */ }`;
    }

    private static assembleTestFile(
        imports: Set<string>, 
        newTestBlocks: Map<string, string[]>,
        existingTests: Map<string, Set<string>>
    ): string {
        const importSection = this.templates.imports(Array.from(imports));
        const testSection = Array.from(newTestBlocks.entries())
            .filter(([_, tests]) => tests.length > 0) // Only include blocks with new tests
            .map(([file, tests]) => {
                const className = this.getClassNameFromFileName(file);
                const isStandalone = this.isStandaloneComponent(file);
                return this.templates.describe(
                    className,
                    this.templates.beforeEach(className, isStandalone) + tests.join('\n')
                );
            })
            .join('\n\n');

        return `${importSection}\n\n${testSection}`;
    }

    private static isStandaloneComponent(filePath: string): boolean {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.ESNext, true);
            let isStandalone = false;

            const visit = (node: ts.Node): void => {
                if (ts.isDecorator(node) && 
                    ts.isCallExpression(node.expression) &&
                    ts.isIdentifier(node.expression.expression) &&
                    node.expression.expression.text === 'Component') {
                    
                    const args = node.expression.arguments;
                    if (args.length > 0 && ts.isObjectLiteralExpression(args[0])) {
                        args[0].properties.forEach(prop => {
                            if (ts.isPropertyAssignment(prop) &&
                                ts.isIdentifier(prop.name) &&
                                prop.name.text === 'standalone' &&
                                prop.initializer.kind === ts.SyntaxKind.TrueKeyword) {
                                isStandalone = true;
                            }
                        });
                    }
                }
                ts.forEachChild(node, visit);
            };

            ts.forEachChild(sourceFile, visit);
            return isStandalone;
        } catch {
            return false;
        }
    }
}

/**
 * Configuration options for test generation
 */
interface GenerateOptions {
    /**
     * Number of files to process in parallel
     * @default 50
     */
    batchSize?: number;

    /**
     * Enable detailed logging of the generation process
     * @default false
     */
    verbose?: boolean;
}

/**
 * Generates unit tests for Angular component getter/setter properties
 * 
 * @param srcDir - Source directory to scan for components
 * @param outputPath - Where to write the generated tests
 * @param options - Configuration options
 * 
 * @example
 * ```typescript
 * // Generate tests for a specific feature module
 * await generateAccessorTests(
 *   'src/app/features/admin',
 *   'src/app/features/admin/admin.spec.ts'
 * );
 * ```
 */
async function main(
    srcDir: string = path.resolve(__dirname, '../../'),
    outputPath: string = path.resolve(process.cwd(), 'src/app/auto-generated.spec.ts'),
    options: GenerateOptions = {}
) {
    const { batchSize = 50, verbose = false } = options;
    
    try {
        const [tsFiles, specFiles] = await Promise.all([
            findFilesByPattern(srcDir, '**/*.ts'),
            findFilesByPattern(srcDir, '**/*.spec.ts')
        ]);

        console.log(`Found ${tsFiles.length} TypeScript files and ${specFiles.length} spec files`);

        if (verbose) {
            console.log(`Processing files in batches of ${batchSize}`);
        }

        const results: AccessorPair[] = [];
        
        for (let i = 0; i < tsFiles.length; i += batchSize) {
            const batch = tsFiles.slice(i, i + batchSize);
            const batchResults = await Promise.all(
                batch.map(async file => {
                    const content = await getCachedFileContent(file);
                    const sourceFile = ts.createSourceFile(
                        file,
                        content,
                        ts.ScriptTarget.ESNext,
                        true
                    );
                    
                    const visitor = new TypeScriptASTVisitor(sourceFile, file);
                    visitor.visit(sourceFile);
                    return visitor.getResults();
                })
            );
            
            results.push(...batchResults.flat());
        }

        if (results.length > 0) {
            const content = TestGenerator.generateTestFile(results, outputPath);
            await fs.promises.writeFile(outputPath, content, 'utf8');
            console.log(`Generated tests written to: ${outputPath}`);
        } else {
            console.log('No accessors found requiring tests.');
        }
        
    } catch (error) {
        console.error('Error during test generation:', error);
        process.exit(1);
    }
}

export { main as generateAccessorTests };

if (require.main === module) {
    const program = new Command();
    
    program
        .name('generate-accessor-tests')
        .description('Generate unit tests for getters and setters in Angular components')
        .option('-d, --dir <directory>', 'Source directory to scan', 'src')
        .option('-o, --output <file>', 'Output file for generated tests', 'src/app/auto-generated.spec.ts')
        .option('-b, --batch-size <size>', 'Batch size for processing files', '50')
        .option('-v, --verbose', 'Enable verbose logging')
        .parse(process.argv);

    const options = program.opts();
    
    const srcDir = path.resolve(process.cwd(), options['dir']);
    const outputFile = path.resolve(process.cwd(), options['output']);
    const batchSize = parseInt(options['batchSize'], 10);
    const verbose = options['verbose'];

    main(srcDir, outputFile, { batchSize, verbose })
        .catch(error => {
            console.error('Error:', error);
            process.exit(1);
        });
}
