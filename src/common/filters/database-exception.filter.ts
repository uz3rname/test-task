import {
  ArgumentsHost,
  Catch,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DatabaseError } from 'pg';

@Catch(DatabaseError)
export class DatabaseExceptionFilter extends BaseExceptionFilter {
  catch(err: DatabaseError, host: ArgumentsHost) {
    super.catch(new InternalServerErrorException(`${err.message}`), host);
  }
}
