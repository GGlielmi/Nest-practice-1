import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { EventsModule } from './events/Event.module';
import { AttendeesModule } from './attendees/attendees.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import config from 'src/config/configuration';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LoginErrorsModule } from './login-errors/login-errors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
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
    LoginErrorsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
