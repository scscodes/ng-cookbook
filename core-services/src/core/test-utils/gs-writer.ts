import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface GetterSetterInfo {
    name: string;
    kind: 'getter' | 'setter';
    type: string;
    file: string;
}

function findTsFiles(dir: string): string[] {
    const files: string[] = fs.readdirSync(dir);
    let tsFiles: string[] = [];
    for (const file of files) {
        const fullPath: string = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            tsFiles = tsFiles.concat(findTsFiles(fullPath));
        } else if (file.endsWith('.ts')) {
            tsFiles.push(fullPath);
        }
    }
    return tsFiles;
}

function findSpecFiles(dir: string): string[] {
    const files: string[] = fs.readdirSync(dir);
    let specFiles: string[] = [];
    for (const file of files) {
        const fullPath: string = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            specFiles = specFiles.concat(findSpecFiles(fullPath));
        } else if (file.endsWith('.spec.ts')) {
            specFiles.push(fullPath);
        }
    }
    return specFiles;
}

function findGettersAndSetters(filePath: string): GetterSetterInfo[] {
    const sourceFile = ts.createSourceFile(
        filePath,
        fs.readFileSync(filePath, 'utf8'),
        ts.ScriptTarget.Latest,
        true
    );
    const gettersAndSetters: GetterSetterInfo[] = [];
    function visit(node: ts.Node): void {
        if (ts.isGetAccessor(node) || ts.isSetAccessor(node)) {
            const name = node.name.getText(sourceFile);
            const kind = ts.isGetAccessor(node) ? 'getter' : 'setter';
            const type = node.type ? node.type.getText(sourceFile) : 'any';
            gettersAndSetters.push({ name, kind, type, file: filePath });
        }
        ts.forEachChild(node, visit);
    }
    visit(sourceFile);
    return gettersAndSetters;
}

function hasUnitTest(functionName: string, filePath: string): boolean {
    const content = fs.readFileSync(filePath, 'utf8');
    const testPatterns = [
        new RegExp(`describe\\s*\\(\\s*['"\`].*${functionName}.*['"\`]`, 'g'),
        new RegExp(`it\\s*\\(\\s*['"\`].*${functionName}.*['"\`]`, 'g')
    ];
    return testPatterns.some((pattern) => pattern.test(content));
}

function checkUnitTests(targets: GetterSetterInfo[], specFiles: string[]): void {
    const results = targets.map((target) => {
        const tested = specFiles.some((specFile) =>
            hasUnitTest(target.name, specFile)
        );
        return { ...target, tested };
    });

    const withTests = results.filter((result) => result.tested);
    const withoutTests = results.filter((result) => !result.tested);

    console.log(`\nTargets with unit tests (${withTests.length}):`);
    withTests.forEach(({ name, kind, type, file }) =>
        console.log(`- ${kind} '${name}' of type '${type}' in file: ${file}`)
    );

    console.log(`\nTargets without unit tests (${withoutTests.length}):`);
    withoutTests.forEach(({ name, kind, type, file }) =>
        console.log(`- ${kind} '${name}' of type '${type}' in file: ${file}`)
    );
}

function main(): void {
    const srcDir: string = path.resolve(__dirname, '../../'); // Use resolved path for clarity
    const tsFiles: string[] = findTsFiles(srcDir);
    const specFiles: string[] = findSpecFiles(srcDir);

    console.log(`Found ${tsFiles.length} TypeScript files.`);
    console.log(`Found ${specFiles.length} spec files.`);

    const results: GetterSetterInfo[] = tsFiles.flatMap(findGettersAndSetters);

    if (results.length > 0) {
        console.log(`Found ${results.length} getters and setters with defined types.`);
        checkUnitTests(results, specFiles);
    } else {
        console.log('No getters or setters found.');
    }
}

// Run the main function
main();
