<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Illuminate\Support\Enumerable;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SalesReportExport implements FromCollection, WithHeadings
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
            'order_number',
            'date',
            'game',
            'package',
            'player_uid',
            'customer',
            'phone',
            'payment_method',
            'payment_status',
            'status',
            'amount',
            'flagged',
        ];
    }
}
