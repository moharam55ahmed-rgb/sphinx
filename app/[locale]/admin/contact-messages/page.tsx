'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/admin/DataTable';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Eye } from 'lucide-react';

export default function ContactMessagesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMsg, setSelectedMsg] = useState<any>(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/contact-messages');
      setData(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await apiClient.delete(`/contact-messages/${id}`);
      toast.success("Message deleted");
      fetch();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (msg: any) => {
    const newStatus = msg.status === 'unread' ? 'read' : 'unread';
    try {
      await apiClient.patch(`/contact-messages/${msg.id}/status`, { status: newStatus });
      fetch();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const columns = [
    { 
      key: 'status', 
      label: 'Status', 
      render: (row: any) => (
        <Badge variant={row.status === 'unread' ? 'destructive' : 'secondary'} className="capitalize">
          {row.status}
        </Badge>
      )
    },
    { key: 'name', label: 'Sender' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    { 
      key: 'createdAt', 
      label: 'Date', 
      render: (row: any) => new Date(row.createdAt).toLocaleDateString() 
    }
  ];

  if (loading && data.length === 0) return <div>Loading messages...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Inquiries</h1>
        <Button variant="outline" onClick={fetch}>Refresh</Button>
      </div>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded">{error}</div>}
      
      <DataTable 
        columns={columns} 
        data={data} 
        onDelete={handleDelete}
        onEdit={(row: any) => setSelectedMsg(row)}
      />

      <Dialog open={!!selectedMsg} onOpenChange={() => setSelectedMsg(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMsg?.status === 'unread' ? <Mail className="w-5 h-5 text-destructive"/> : <MailOpen className="w-5 h-5 text-muted-foreground"/>}
              Message from {selectedMsg?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
              <div>
                <span className="text-muted-foreground block">From:</span>
                <span className="font-medium">{selectedMsg?.name} &lt;{selectedMsg?.email}&gt;</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Phone:</span>
                <span className="font-medium">{selectedMsg?.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Date:</span>
                <span className="font-medium">{selectedMsg ? new Date(selectedMsg.createdAt).toLocaleString() : ''}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Subject:</span>
                <span className="font-medium">{selectedMsg?.subject || 'No Subject'}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Message Body</Label>
              <div className="p-4 border rounded-lg bg-card min-h-[150px] whitespace-pre-wrap">
                {selectedMsg?.message}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between items-center">
            <Button variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => {
              handleDelete(selectedMsg.id);
              setSelectedMsg(null);
            }}>
              <Trash2 className="w-4 h-4 mr-2"/> Delete Permanent
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toggleStatus(selectedMsg)}>
                Mark as {selectedMsg?.status === 'unread' ? 'Read' : 'Unread'}
              </Button>
              <Button onClick={() => setSelectedMsg(null)}>Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
