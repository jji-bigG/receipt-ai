import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { List, ListItem } from "@/components/ui/list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  return (
    <main className="flex flex-1 flex-col gap-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Welcome to Group Grocery Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Make managing groceries with friends and family simple. Our system
            helps you keep track of requests, receipts, and balances
            effortlessly.
          </p>
          <Separator />
          <List className="space-y-3">
            <ListItem>
              <Badge variant="outline" className="mr-2">
                1
              </Badge>
              <span>Sign up and join a group</span>
            </ListItem>
            <ListItem>
              <Badge variant="outline" className="mr-2">
                2
              </Badge>
              <span>Add grocery item requests</span>
            </ListItem>
            <ListItem>
              <Badge variant="outline" className="mr-2">
                3
              </Badge>
              <span>Upload receipts after shopping</span>
            </ListItem>
            <ListItem>
              <Badge variant="outline" className="mr-2">
                4
              </Badge>
              <span>AI analyzes and assigns items</span>
            </ListItem>
          </List>
          <Separator />
          <Button variant="outline">Get Started</Button>
        </CardContent>
      </Card>
    </main>
  );
}
