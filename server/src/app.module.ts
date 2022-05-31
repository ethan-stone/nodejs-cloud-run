import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventsModule,
    AuthModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const config = {
          connectionURI: configService.get('SUPERTOKENS_CONNECTION_URI'),
          appInfo: {
            appName: configService.get('APP_NAME'),
            apiDomain: configService.get('API_DOMAIN'),
            websiteDomain: configService.get('WEBSITE_DOMAIN'),
            apiBasePath: configService.get('API_BASE_PATH'),
            websiteBasePath: configService.get('WEBSITE_BASE_PATH'),
          },
        };

        return config;
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
