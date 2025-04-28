import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
export default function FeatureCardNavigation() {
  const socialItems = [
    { name: "Chat", path:'/social/chat' },
    { name: "Facebook", path:'/social/facebook' },
    { name: "Instagram", path:'/social/instagram' },
    { name: "Twitter", path:'/social/X' },
  ]

  return (
      <Card className="w-64 backdrop-blur-md h-full  shadow-black/60  bg-white/30 border-white/50 shadow-lg">
        <CardContent className="p-4 flex flex-col gap-2">
          {socialItems.map((item, index) => (
            <Link href={item.path}
              key={item.name}
              className="flex items-center shadow-sm shadow-black/20 space-x-4 p-3 rounded-lg transition-all duration-100 ease-in-out hover:bg-indigo-800/20 cursor-pointer mb-2 last:mb-0"
            >
              <span className="text-lg font-medium text-black/70">{item.name}</span>
            </Link>
          ))}
        </CardContent>
      </Card>

  )
}