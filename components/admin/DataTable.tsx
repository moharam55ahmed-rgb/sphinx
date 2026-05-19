'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatBilingual } from '@/lib/translate';

export function DataTable({ columns, data, onEdit, onDelete, onStatusChange, editHref }: any) {
  const t = useTranslations('admin.table');
  if (!data || data.length === 0) {
    return <div className="text-center p-12 bg-card rounded-lg border border-border text-muted-foreground">No data found.</div>;
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col: any) => <TableHead key={col.key}>{col.label}</TableHead>)}
            <TableHead className="text-end">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any) => (
            <TableRow key={row.id}>
              {columns.map((col: any) => (
                <TableCell key={col.key}>
                  {col.render
                    ? col.render(row)
                    : (() => {
                        const val = row[col.key];
                        if (val == null) return '';
                        if (typeof val === 'object') return formatBilingual(val);
                        return String(val);
                      })()}
                </TableCell>
              ))}
              <TableCell className="text-end">
                <div className="flex justify-end gap-2">
                  {editHref && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={editHref(row.id)}><Edit className="w-4 h-4" /></Link>
                    </Button>
                  )}
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="destructive" size="sm" onClick={() => {
                      if(confirm('Are you sure you want to delete this item?')) onDelete(row.id);
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}