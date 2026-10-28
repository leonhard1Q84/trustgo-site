'use client';

import { useState, type ComponentProps } from 'react';
import type { SearchFormState } from '../domain/search-form';
import { SearchSummaryBar } from './search-summary-bar';
import { RentalResultsView } from './RentalResultsView';

type RentalSearchResultsProps = Omit<ComponentProps<typeof RentalResultsView>, 'onEditSearch'> & {
  form: SearchFormState;
};

export function RentalSearchResults({ form, ...results }: RentalSearchResultsProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <SearchSummaryBar lang={results.lang} form={form} editing={editing} onEditingChange={setEditing} />
      <RentalResultsView {...results} onEditSearch={() => setEditing(true)} />
    </div>
  );
}
