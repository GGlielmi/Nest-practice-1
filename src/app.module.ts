import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { EventsModule } from './events/Event.module';
import { AttendeesModule } from './attendees/attendees.module';
import config from 'src/config/configuration';

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
    EventsModule,
    AttendeesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
