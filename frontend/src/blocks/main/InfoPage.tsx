import React from 'react';
import InfoPageLayout from './components/InfoPageLayout';
import { useParams } from 'react-router-dom';

const pagesData: Record<string, { title: string; content: string }> = {
  about: {
    title: 'Про нас',
    content: 'AutoHub — це онлайн-платформа для покупки, продажу та обслуговування авто в Україні.',
  },
  contact: {
    title: 'Контакти',
    content: 'Email: support@autohub.ua\nТелефон: +380 (44) 123-45-67',
  },
};

export default function InfoPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = pagesData[slug || ''];

  if (!page) {
    return (
      <InfoPageLayout title="Сторінка не знайдена">
        <p>Цієї сторінки не існує</p>
      </InfoPageLayout>
    );
  }

  return (
    <InfoPageLayout title={page.title}>
      {page.content.split('\n').map((text, idx) => (
        <p key={idx} className="mb-2">{text}</p>
      ))}
    </InfoPageLayout>
  );
}