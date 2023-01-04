import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

@Schema()
export class CourierLocation {
  @Prop({ required: true, unique: true })
  @ApiProperty({ required: true, default: '1' })
  courierId: string;

  @Prop({ required: true })
  @ApiProperty({ required: true, default: '1' })
  queueOrder: number;

  @Prop({ required: true })
  @ApiProperty({ required: true, default: '41 24.2028' })
  latitude: string;

  @Prop({ required: true })
  @ApiProperty({ required: true, default: '2 10.4418' })
  longitude: string;
}

export type CourierLocationDocument = CourierLocation & Document;

export const CourierLocationSchema = SchemaFactory.createForClass(CourierLocation);
