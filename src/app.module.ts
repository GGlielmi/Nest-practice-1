import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/Event.module';
import { AttendeesModule } from './attendees/attendees.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import config from 'src/config/configuration';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoginModule } from './login/login.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuardJwt } from './auth/guards/auth-guard.jwt';
import { OrganizersModule } from './organizers/organizers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const { database, environment } = config();
        return {
          ...database,
          type: 'postgres',
          logging: true,
          autoLoadEntities: true,
          synchronize: environment === 'development',
        };
      },
    }),
    AuthModule,
    EventsModule,
    AttendeesModule,
    ManufacturerModule,
    UserModule,
    LoginModule,
    OrganizersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuardJwt,
    },
  ],
})
export class AppModule {}
