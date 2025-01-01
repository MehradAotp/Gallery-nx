import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Suppliers } from './suppliers.schema';
import { LeanDocument, Model, PipelineStage } from 'mongoose';
import { CreateSuppliersDto } from './dto/createSuppliers.dto';
import { UpdateSuppliersDto } from './dto/updateSuppliers.dto';
import { suppliresToDtoOutput } from './dto/outputSupplires.dto';
import { SuppliresDatatableDto } from './dto/datatable.dto';
import { PaginateRequestDto } from './dto/Paginate.request.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectModel(Suppliers.name) private suppliersModel: Model<Suppliers>
  ) {}

  async create(create: CreateSuppliersDto): Promise<suppliresToDtoOutput> {
    const createdSuppliers = new this.suppliersModel(create);
    const savedSupplires = await createdSuppliers.save();
    return this.docToDto(savedSupplires);
  }

  async all(): Promise<suppliresToDtoOutput[]> {
    const docs = await this.suppliersModel.find().lean().exec();

    return Promise.all(docs.map((doc) => this.docToDto(doc)));
  }
  async findOne(id: string): Promise<suppliresToDtoOutput | null> {
    const doc = await this.suppliersModel.findById(id).lean().exec();

    if (!doc) return null;
    return this.docToDto(doc);
  }

  async update(
    id: string,
    updateSuppliersDto: UpdateSuppliersDto
  ): Promise<void> {
    const doc = await this.suppliersModel.findById(id);

    if (!doc) {
      return;
    }
    doc.set(updateSuppliersDto);
    await doc.save();
  }

  async delete(id: string): Promise<void> {
    const doc = await this.suppliersModel.findById(id);
    if (!doc) {
      return;
    }
    await doc.delete();
  }

  async datatable(input: PaginateRequestDto): Promise<SuppliresDatatableDto> {
    const { skip, limit } = input;
    if (limit === 0) {
      return {
        total: 0,
        data: [],
      };
    }

    const pipeline: PipelineStage[] = [];
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({
      $facet: {
        total: [{ $count: 'total' }],
        data: [{ $skip: Number(skip || 0) }, { $limit: Number(limit || 10) }],
      },
    });

    const result = await this.suppliersModel.aggregate(pipeline).exec();
    const total = result[0]?.total[0] || { total: 0 };
    const dataDocs = result[0]?.data || [];
    const data = await Promise.all(
      dataDocs.map((doc: LeanDocument<Suppliers>) => this.docToDto(doc))
    );

    return {
      total: total,
      data: data,
    };
  }

  private async docToDto(
    input: LeanDocument<Suppliers>
  ): Promise<suppliresToDtoOutput> {
    const { title, datalidAccount, createdAt } = input;

    return {
      id: input._id.toString(),
      title,
      datalidAccount,
      createdAt,
    };
  }
}
