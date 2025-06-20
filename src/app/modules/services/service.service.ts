/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder';
import { Iservice } from './service.interface';
import Service from './service.model';

const insertServiceIntoDb = async (payload: Iservice) => {
  const result = await Service.create(payload);
  return result;
};

const getAllServices = async (query: Record<string, any>) => {
  const serviceModel = new QueryBuilder(
    Service.find()
      .populate({ path: 'category', select: 'title' })
      .populate('shop'),
    query,
  )
    .filter()
    .search([])
    .fields()
    .paginate()
    .sort();

  const result = await serviceModel.modelQuery;
  const meta = await serviceModel.countTotal();

  return {
    data: result,
    meta,
  };
};

const getMyServices = async (id: string) => {
  const result = await Service.find({ shop: id }).populate({
    path: 'category',
    select: 'image title',
  });
  return result;
};
const getSingleService = async (id: string) => {
  const result = await Service.findById(id).populate('shop');
  return result;
};

const updateService = async (id: string, payload: Partial<Iservice>) => {
  // Remove category if it's an empty string
  if (typeof payload.category === 'string' && payload.category === '') {
    delete payload.category;
  }
  const result = await Service.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const serviceServices = {
  insertServiceIntoDb,
  getMyServices,
  getAllServices,
  getSingleService,
  updateService,
};
