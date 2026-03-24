import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, Shield, Trash2, Pencil, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DriverReg = {
  id: string;
  mobile: string;
  license_number: string;
  vehicle_number: string;
  ownership_type: string;
  hospital_name: string | null;
  ambulance_type: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

type HospitalReg = {
  id: string;
  hospital_name: string;
  id_type: string;
  id_number: string;
  facilities: string | null;
  address: string;
  business_contact: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  approved: "bg-green-100 text-green-800 border-green-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
};

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [drivers, setDrivers] = useState<DriverReg[]>([]);
  const [hospitals, setHospitals] = useState<HospitalReg[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Edit dialog state
  const [editDialog, setEditDialog] = useState<{ type: "driver" | "hospital"; data: any } | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    checkAdminRole();
  }, [user, authLoading]);

  const checkAdminRole = async () => {
    const { data } = await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" });
    if (!data) {
      toast({ title: "Access Denied", description: "You don't have admin privileges.", variant: "destructive" });
      navigate("/");
      return;
    }
    setIsAdmin(true);
    setChecking(false);
    fetchData();
  };

  const fetchData = async () => {
    setLoadingData(true);
    const [dRes, hRes] = await Promise.all([
      supabase.from("driver_registrations").select("*").order("created_at", { ascending: false }),
      supabase.from("hospital_registrations").select("*").order("created_at", { ascending: false }),
    ]);
    if (dRes.data) setDrivers(dRes.data as DriverReg[]);
    if (hRes.data) setHospitals(hRes.data as HospitalReg[]);
    setLoadingData(false);
  };

  const updateStatus = async (type: "driver" | "hospital", id: string, status: string, notes: string) => {
    setSaving(true);
    const table = type === "driver" ? "driver_registrations" : "hospital_registrations";
    const { error } = await supabase.from(table).update({ status, admin_notes: notes }).eq("id", id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: `Registration ${status}.` });
      setEditDialog(null);
      fetchData();
    }
  };

  const deleteRegistration = async (type: "driver" | "hospital", id: string) => {
    const table = type === "driver" ? "driver_registrations" : "hospital_registrations";
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Registration removed." });
      fetchData();
    }
  };

  const openEdit = (type: "driver" | "hospital", data: any) => {
    setEditDialog({ type, data });
    setEditStatus(data.status);
    setEditNotes(data.admin_notes || "");
  };

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-4 h-16 px-4">
          <button onClick={() => navigate("/")} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="font-display text-lg font-bold">Admin Dashboard</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold">{drivers.length}</div>
            <div className="text-xs text-muted-foreground">Driver Requests</div>
          </CardContent></Card>
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold">{hospitals.length}</div>
            <div className="text-xs text-muted-foreground">Hospital Requests</div>
          </CardContent></Card>
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{drivers.filter(d => d.status === "pending").length + hospitals.filter(h => h.status === "pending").length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </CardContent></Card>
          <Card><CardContent className="pt-4 text-center">
            <div className="text-2xl font-bold text-green-600">{drivers.filter(d => d.status === "approved").length + hospitals.filter(h => h.status === "approved").length}</div>
            <div className="text-xs text-muted-foreground">Approved</div>
          </CardContent></Card>
        </div>

        <Tabs defaultValue="drivers">
          <TabsList className="mb-4">
            <TabsTrigger value="drivers">Driver Registrations</TabsTrigger>
            <TabsTrigger value="hospitals">Hospital Registrations</TabsTrigger>
          </TabsList>

          <TabsContent value="drivers">
            <Card>
              <CardHeader><CardTitle className="text-base">Driver Registration Requests</CardTitle></CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
                ) : drivers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No driver registrations yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mobile</TableHead>
                          <TableHead>License</TableHead>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Ownership</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {drivers.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-mono text-sm">{d.mobile}</TableCell>
                            <TableCell className="text-sm">{d.license_number}</TableCell>
                            <TableCell className="text-sm">{d.vehicle_number}</TableCell>
                            <TableCell className="text-sm">{d.ambulance_type}</TableCell>
                            <TableCell className="text-sm capitalize">{d.ownership_type}{d.hospital_name ? ` (${d.hospital_name})` : ""}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColors[d.status] || ""}>{d.status}</Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" onClick={() => openEdit("driver", d)} title="Edit"><Pencil className="w-4 h-4" /></Button>
                                {d.status === "pending" && (
                                  <>
                                    <Button size="icon" variant="ghost" className="text-green-600" onClick={() => updateStatus("driver", d.id, "approved", "")} title="Approve"><CheckCircle className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="text-red-600" onClick={() => updateStatus("driver", d.id, "rejected", "")} title="Reject"><XCircle className="w-4 h-4" /></Button>
                                  </>
                                )}
                                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteRegistration("driver", d.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hospitals">
            <Card>
              <CardHeader><CardTitle className="text-base">Hospital Registration Requests</CardTitle></CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin" /></div>
                ) : hospitals.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No hospital registrations yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hospital</TableHead>
                          <TableHead>ID Type</TableHead>
                          <TableHead>ID Number</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {hospitals.map((h) => (
                          <TableRow key={h.id}>
                            <TableCell className="font-medium text-sm">{h.hospital_name}</TableCell>
                            <TableCell className="text-sm uppercase">{h.id_type}</TableCell>
                            <TableCell className="font-mono text-sm">{h.id_number}</TableCell>
                            <TableCell className="font-mono text-sm">{h.business_contact}</TableCell>
                            <TableCell className="text-sm max-w-[200px] truncate">{h.address}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColors[h.status] || ""}>{h.status}</Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="icon" variant="ghost" onClick={() => openEdit("hospital", h)} title="Edit"><Pencil className="w-4 h-4" /></Button>
                                {h.status === "pending" && (
                                  <>
                                    <Button size="icon" variant="ghost" className="text-green-600" onClick={() => updateStatus("hospital", h.id, "approved", "")} title="Approve"><CheckCircle className="w-4 h-4" /></Button>
                                    <Button size="icon" variant="ghost" className="text-red-600" onClick={() => updateStatus("hospital", h.id, "rejected", "")} title="Reject"><XCircle className="w-4 h-4" /></Button>
                                  </>
                                )}
                                <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteRegistration("hospital", h.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Registration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Admin Notes</label>
              <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Add notes about this registration..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(null)}>Cancel</Button>
            <Button disabled={saving} onClick={() => editDialog && updateStatus(editDialog.type, editDialog.data.id, editStatus, editNotes)}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
