'use client';

import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import NextLink from 'next/link';

export default function MuiNextLink(props: any) {
    return <Link component={NextLink} {...props} />;
}

export function ButtonLink(props: any) {
    return <Button component={NextLink} {...props} />;
}
