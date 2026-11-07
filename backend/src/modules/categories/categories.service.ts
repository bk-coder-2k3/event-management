import { prisma } from '../../config/db';
import { generateSlug } from '../../utils/slugify';
import { ConflictError, NotFoundError } from '../../utils/errors';

export class CategoriesService {
  static async getAllCategories(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    return prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            vendors: {
              where: { approvalStatus: 'APPROVED' },
            },
          },
        },
      },
    });
  }

  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            vendors: {
              where: { approvalStatus: 'APPROVED' },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  static async createCategory(data: any) {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictError('A category with this slug already exists');
    }

    return prisma.category.create({
      data: {
        name: data.name.trim(),
        slug,
        description: data.description.trim(),
        icon: data.icon || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: data.sortOrder || 0,
      },
    });
  }

  static async updateCategory(id: string, data: any) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundError('Category not found');

    if (data.name && !data.slug) {
      data.slug = generateSlug(data.name);
    }

    return prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { vendors: true } } },
    });
    if (!category) throw new NotFoundError('Category not found');

    if (category._count.vendors > 0) {
      throw new ConflictError('Cannot delete category with associated vendors. Please reassign or disable it instead.');
    }

    await prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}
