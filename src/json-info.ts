import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import {JsonObject} from '@angular-devkit/core';

interface BuildJsonOptions extends JsonObject {
    version: string;
}

const myBuilder = ({version}: BuildJsonOptions, context: BuilderContext): Promise<BuilderOutput> => {
    const date = new Date().toISOString();

    const buildJson = {
        version,
        date
    }

    const outputPath = join(context.workspaceRoot, 'src', 'assets', 'build-info.json');
    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
    }
    try {
        writeFileSync(outputPath, JSON.stringify(buildJson, null, 2));
        context.logger.info('build.json file created successfully!');
        return Promise.resolve({ success: true });
    } catch (error) {
        context.logger.error('Error writing build.json file:');
        return Promise.reject(error);
    }
}

export default createBuilder(myBuilder);