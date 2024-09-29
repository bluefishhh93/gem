import { CustomBracelet } from "@/hooks/use-cart-store";
import { CustomItem } from "./CustomItem";


interface CustomListProps {
    customBracelets: CustomBracelet[];
}
export default function CustomList({ customBracelets }: CustomListProps) {
    return (
        <ul className="grid gap-4 px-6">
            {
                customBracelets.map((customBracelet, index) => (
                    <li key={index}>
                        <CustomItem customBracelet={customBracelet} />
                    </li>
                ))
            }
        </ul>
    )
}


