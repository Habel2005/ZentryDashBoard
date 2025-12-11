import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>
            Manage system-wide settings. These are mock settings for demonstration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-medium">Data Retention</h3>
            <div className="space-y-2">
              <Label htmlFor="retention-period">Session Data Retention Period (Days)</Label>
              <div className="flex items-center gap-4">
                <Slider id="retention-period" defaultValue={[90]} max={365} step={1} />
                <span className="w-16 text-center font-mono p-2 rounded-md border">90</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Data older than this period will be automatically purged.
              </p>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Cache Settings</h3>
            <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="cache-ttl">Cache TTL (Seconds)</Label>
                <Input id="cache-ttl" type="number" defaultValue={300} />
                <p className="text-sm text-muted-foreground">
                    Time-to-live for cached session summaries.
                </p>
            </div>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium">AI Features</h3>
            <div className="flex items-center space-x-4 rounded-md border p-4">
                <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                        Enable Session Summaries
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Automatically generate a summary for each completed session.
                    </p>
                </div>
                <Switch defaultChecked />
            </div>
          </div>

        </CardContent>
        <CardFooter>
            <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
