import { prisma } from '../../config/db';
import { ForbiddenError, NotFoundError } from '../../utils/errors';
import { ROLES } from '@vizhaspace/shared';

export class PackagesService {
  static async createPackage(vendorId: string, userId: string, userRole: string, data: any) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundError('Vendor not found');

    if (vendor.ownerUserId !== userId && userRole !== ROLES.ADMIN) {
      throw new ForbiddenError('Unauthorized to create packages for this vendor');
    }

    const pkg = await prisma.servicePackage.create({
      data: {
        vendorId,
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        currency: data.currency || 'INR',
        inclusions: data.inclusions,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return pkg;
  }

  static async updatePackage(vendorId: string, packageId: string, userId: string, userRole: string, data: any) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundError('Vendor not found');

    if (vendor.ownerUserId !== userId && userRole !== ROLES.ADMIN) {
      throw new ForbiddenError('Unauthorized to modify packages for this vendor');
    }

    const pkg = await prisma.servicePackage.findFirst({
      where: { id: packageId, vendorId },
    });
    if (!pkg) throw new NotFoundError('Package not found');

    const updated = await prisma.servicePackage.update({
      where: { id: packageId },
      data,
    });

    return updated;
  }

  static async deletePackage(vendorId: string, packageId: string, userId: string, userRole: string) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundError('Vendor not found');

    if (vendor.ownerUserId !== userId && userRole !== ROLES.ADMIN) {
      throw new ForbiddenError('Unauthorized to delete packages for this vendor');
    }

    const pkg = await prisma.servicePackage.findFirst({
      where: { id: packageId, vendorId },
    });
    if (!pkg) throw new NotFoundError('Package not found');

    await prisma.servicePackage.delete({ where: { id: packageId } });
    return { message: 'Package deleted successfully' };
  }
}
