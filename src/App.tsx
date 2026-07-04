/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MainGame } from './components/MainGame';

export default function App() {
  return (
    <div className="w-full h-screen bg-[#f8f9fa] font-sans selection:bg-green-200">
      <MainGame />
    </div>
  );
}
