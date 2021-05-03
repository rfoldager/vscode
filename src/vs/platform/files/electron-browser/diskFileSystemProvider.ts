/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DiskFileSystemProvider as NodeDiskFileSystemProvider, IDiskFileSystemProviderOptions } from 'vs/platform/files/node/diskFileSystemProvider';
import { FileDeleteOptions, FileSystemProviderCapabilities } from 'vs/platform/files/common/files';
import { ILogService } from 'vs/platform/log/common/log';
import { INativeHostService } from 'vs/platform/native/electron-sandbox/native';

export class DiskFileSystemProvider extends NodeDiskFileSystemProvider {

	constructor(
		logService: ILogService,
		private readonly nativeHostService: INativeHostService,
		options?: IDiskFileSystemProviderOptions
	) {
		super(logService, options);
	}

	override get capabilities(): FileSystemProviderCapabilities {
		if (!this._capabilities) {
			this._capabilities = super.capabilities | FileSystemProviderCapabilities.Trash;
		}

		return this._capabilities;
	}

	protected override doDelete(filePath: string, opts: FileDeleteOptions): Promise<void> {
		if (!opts.useTrash) {
			return super.doDelete(filePath, opts);
		}

		return this.nativeHostService.moveItemToTrash(filePath);
	}
}
