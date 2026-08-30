import { SOCIAL_LINKS, WHATSAPP_MESSAGES } from '@/lib/constants';
import { getProducts } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import ShopTheLookClient from './ShopTheLookClient';

export default async function ShopTheLook() {
  const allProducts = await getProducts();
  const pick1 = allProducts.find(p => p.name === 'Elegant Quartz') || allProducts[0];
  const pick2 = allProducts.find(p => p.name === 'Lava Eclipse') || allProducts[1];

  const hotspots = [
    {
      id: 1,
      top: '60%',
      left: '20%',
      name: pick1.name,
      price: formatPrice(pick1.price),
      slug: pick1.slug,
      product: pick1,
      link: `/product/${pick1.slug}`,
    },
    {
      id: 2,
      top: '75%',
      left: '75%',
      name: pick2.name,
      price: formatPrice(pick2.price),
      slug: pick2.slug,
      product: pick2,
      link: `/product/${pick2.slug}`,
    },
    {
      id: 3,
      top: '60%',
      left: '85%',
      name: 'Custom Order',
      price: 'Price varies',
      slug: null,
      product: null,
      link: '/custom-order',
    }
  ];

  const whatsappUrl = `${SOCIAL_LINKS.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.customOrder)}`;

  return <ShopTheLookClient hotspots={hotspots} whatsappUrl={whatsappUrl} />;
}
