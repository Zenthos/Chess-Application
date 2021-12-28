import { DefaultLayout, Loading } from '@common';
import { Category } from '@modules';
import { useRouter } from 'next/router';

const CategoryPage = () => {
  const { query } = useRouter();

  if (!Object.hasOwnProperty.call(query, 'category')) return <Loading />;

  return DefaultLayout(Category)()
}

export default CategoryPage;