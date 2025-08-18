// You can return actual nodes or config nodes—both work
import React from "react";

const Start = {
    type: "Page",
    children: [
        {
            type: "Section",
            props: { title: "BPA Application" },
            children: [
                {
                    type: "Card",
                    props: { title: "Create" },
                    children: [
                        { type: "Button", props: { label: "Start", action: "bpa.start" } }
                    ]
                }
            ]
        }
    ]
};

export default { Start };
