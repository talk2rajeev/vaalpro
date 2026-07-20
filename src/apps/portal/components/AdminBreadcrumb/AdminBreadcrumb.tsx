import { Fragment } from 'react';
import { Link } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/core-components/breadcrumb/breadcrumb';

export interface AdminBreadcrumbItem {
  label: string;
  to?: string;
}

interface AdminBreadcrumbProps {
  items: AdminBreadcrumbItem[];
}

const AdminBreadcrumb = ({ items }: AdminBreadcrumbProps) => (
  <Breadcrumb>
    <BreadcrumbList className="text-xs">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.to && !isLast ? (
                <BreadcrumbLink asChild>
                  <Link to={item.to}>{item.label}</Link>
                </BreadcrumbLink>
              ) : !isLast ? (
                <span>{item.label}</span>
              ) : (
                <BreadcrumbPage className="font-bold text-blue-800">{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        );
      })}
    </BreadcrumbList>
  </Breadcrumb>
);

export default AdminBreadcrumb;
