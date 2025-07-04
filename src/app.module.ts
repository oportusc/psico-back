import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { CalendarModule } from './calendar/calendar.module';
import { PsychologistsModule } from './psychologists/psychologists.module';

@Module({
  imports: [
    // Environment variables configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // MongoDB configuration (sin autenticación para desarrollo)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('DATABASE_HOST') || 'localhost'}:${configService.get('DATABASE_PORT') || '27017'}/${configService.get('DATABASE_NAME') || 'psico_db'}`,
      }),
      inject: [ConfigService],
    }),
    
    // GraphQL configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // Enable GraphQL Playground
      introspection: true,
    }),
    UsersModule,
    AppointmentsModule,
    CalendarModule,
    PsychologistsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 