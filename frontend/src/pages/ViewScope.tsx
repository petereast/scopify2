import React from 'react';

import { useParams } from 'react-router-dom';
import ScopeView from '../components/ShowScope';

export default function ShowScope() {
  const {id}= useParams<{id: string}> ();

  return (<ScopeView scopeId={id} />)
}
