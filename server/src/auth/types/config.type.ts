import { ModuleMetadata } from '@nestjs/common';
import { AppInfo } from 'supertokens-node/lib/build/types';

export const ConfigInjectionToken = 'ConfigInjectionToken';

export type AuthModuleConfig = {
  appInfo: AppInfo;
  connectionURI: string;
  apiKey?: string;
};

export interface AuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<AuthModuleConfig> | AuthModuleConfig;
  inject?: any[];
}
