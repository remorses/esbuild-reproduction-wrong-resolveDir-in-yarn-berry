import { NodeResolvePlugin } from '@esbuild-plugins/all'
import { build } from 'esbuild'
import path from 'path'
import fs from 'fs'
import child_process = require('child_process')

build({
    bundle: true,
    outdir: 'bundle',
    format: 'esm',
    splitting: true,
    target: 'es2020',
    entryPoints: [path.resolve('./src/index.ts')],
    metafile: 'meta.json',
    plugins: [
        {
            name: 'test',
            setup({ onResolve }) {
                onResolve({ filter: /.*/ }, (a) => {
                    console.log('path:', a.path)
                    console.log('resolveDir:', a.resolveDir)
                    console.log()
                })
            },
        },
        NodeResolvePlugin({
            onResolved: (x) => {
                // console.log({ x, cwd: process.cwd() })
            },
            onNonResolved: () => {},
            extensions: ['.png', '.ts', '.js'],
        }),
    ],
}).then(() => {
    const meta = JSON.parse(fs.readFileSync('meta.json').toString())
    console.log()
    console.log()
    for (let input in meta.inputs) {
        if (!fs.existsSync(input)) {
            console.error(`File '${input}' in metafile does not exist!`)
        }
    }
})
