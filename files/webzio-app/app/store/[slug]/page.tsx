import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dbConnect from '../../../lib/db'
import Website from '../../../models/Website'
import Product from '../../../models/Product'
import Template1 from '../../../components/templates/Template1'
import Template2 from '../../../components/templates/Template2'

interface Props { params: { slug: string } }

async function getStoreData(slug: string) {
  await dbConnect()
  const website = await Website.findOneAndUpdate(
    { slug, isActive: true },
    { $inc: { views: 1 } },
    { new: true }
  ).lean()
  if (!website) return null
  const products = await Product.find({ websiteId: (website as any)._id })
    .sort({ featured: -1, createdAt: -1 }).lean()
  return { website, products }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getStoreData(params.slug)
  if (!data) return { title: 'Hotel / Restaurant Not Found' }
  const { website } = data as any
  return {
    title: website.content?.seoTitle || website.siteName,
    description: website.content?.seoDescription || `Visit ${website.siteName}`,
    openGraph: {
      title: website.siteName,
      description: website.content?.seoDescription || '',
      images: website.content?.heroImage ? [website.content.heroImage] : [],
    }
  }
}

export default async function StorefrontPage({ params }: Props) {
  const data = await getStoreData(params.slug)
  if (!data) notFound()

  const { website, products } = data as any
  const props = { website, products }

  // Pivot to Restaurant and Hotel - handle old template IDs gracefully
  switch (website.templateId) {
    case 1: return <Template1 {...props} />
    case 2: return <Template2 {...props} />
    default: return (website.templateId % 2 === 0) ? <Template2 {...props} /> : <Template1 {...props} />
  }
}
