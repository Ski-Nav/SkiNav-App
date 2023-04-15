/* 
App.tsx's purpose is to render the Main component. If there are other 
configurations we need (such as disabling font scaling), we can do 
that in the Main component.

I use typescript because it allows for typecasting in Javascript to
catch some nasty runtime bugs that would be pretty hard to spot
otherwise. Typescript is just Javascript but with typecasting
capabilities.
*/

import React from "react";
import Main from "./src/Main";

export default function App() {
  return <Main />;
}
