'use client';

import { useEffect, useState } from 'react';
import { getMenu } from '@/lib/api/clientApi';
import type { MenuCategory } from '@/types/menu';

export default function MenuClient() {
    const [data, setData] = useState<MenuCategory[]>([]);

    useEffect(() => {
        getMenu().then(setData);
    }, []);

    return <div>{data.length}</div>;
}