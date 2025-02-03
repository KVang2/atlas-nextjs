import React from "react";

export default async function Page({ params }: { params: { id: string } }) {

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return <div>Topic Page: {params.id}</div>;
  }
  