import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Download,
  Trash2,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">
              Manage your account and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Navigation */}
          <div className="space-y-2">
            <Card className="shadow-lg border-0">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 bg-blue-50 text-blue-700"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Bell className="h-4 w-4" />
                    Notifications
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Shield className="h-4 w-4" />
                    Privacy
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Palette className="h-4 w-4" />
                    Appearance
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Enter your company name" />
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive analysis results via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-gray-500">
                      Get weekly progress summaries
                    </p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">New Feature Updates</p>
                    <p className="text-sm text-gray-500">
                      Stay informed about new features
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-gray-500">
                      Download all your analysis history
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-red-700">Delete Account</p>
                    <p className="text-sm text-red-500">
                      Permanently delete your account and data
                    </p>
                  </div>
                  <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
