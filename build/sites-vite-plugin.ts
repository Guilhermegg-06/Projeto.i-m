import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

export function sites(): Plugin {
  return {
    name: 'imvester-sites-output',
    apply: 'build',
    closeBundle() {
      const root = process.cwd()
      const serverDir = resolve(root, 'dist/server')
      const metadataDir = resolve(root, 'dist/.openai')

      mkdirSync(serverDir, { recursive: true })
      mkdirSync(metadataDir, { recursive: true })
      copyFileSync(resolve(root, 'worker/index.js'), resolve(serverDir, 'index.js'))
      copyFileSync(
        resolve(root, '.openai/hosting.json'),
        resolve(metadataDir, 'hosting.json'),
      )
    },
  }
}
