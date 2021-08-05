import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class RequiredParamPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): Date {
    if (value === undefined) {
      throw new BadRequestException(`Parameter "${metadata.data}" is required`);
    }
    return value;
  }
}
