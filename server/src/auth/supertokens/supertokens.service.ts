import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import ThirdPartEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import { ConfigInjectionToken, AuthModuleConfig } from '../types/config.type';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    configService: ConfigService,
  ) {
    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        ThirdPartEmailPassword.init({
          providers: [
            ThirdPartEmailPassword.Google({
              clientId: configService.get('GOOGLE_CLIENT_ID'),
              clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            }),
          ],
        }),
        Session.init(),
      ],
    });
  }
}
