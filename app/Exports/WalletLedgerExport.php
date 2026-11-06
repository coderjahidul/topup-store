<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Illuminate\Support\Enumerable;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class WalletLedgerExport implements FromCollection, WithHeadings
{
    use Exportable;

    public function __construct(private Collection $rows) {}

    public function collection(): Enumerable
    {
        return $this->rows->map(fn (array $row) => array_values($row));
    }

    /**
     * @return list<string>
     */
    public function headings(): array
    {
        return [
            'id',
            'date',
            'user',
            'phone',
            'type',
            'source',
            'amount',
            'balance_before',
            'balance_after',
            'note',
        ];
    }
}
