<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SalesReportExport;
use App\Exports\WalletLedgerExport;
use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ReportController extends Controller
{
    public function __construct(private ReportService $reports) {}

    public function index(Request $request): InertiaResponse
    {
        $from = $request->string('from')->toString() ?: null;
        $to = $request->string('to')->toString() ?: null;

        return Inertia::render('Admin/Reports/Index', [
            'report' => $this->reports->overview($from, $to),
            'filters' => [
                'from' => $from ?? now()->subDays(29)->toDateString(),
                'to' => $to ?? now()->toDateString(),
            ],
        ]);
    }

    public function exportSalesExcel(Request $request): BinaryFileResponse
    {
        $from = $request->string('from')->toString() ?: null;
        $to = $request->string('to')->toString() ?: null;
        $rows = $this->reports->salesRows($from, $to);

        return (new SalesReportExport($rows))->download(
            'sales-report-'.now()->format('Ymd-His').'.xlsx'
        );
    }

    public function exportWalletExcel(Request $request): BinaryFileResponse
    {
        $from = $request->string('from')->toString() ?: null;
        $to = $request->string('to')->toString() ?: null;
        $rows = $this->reports->walletRows($from, $to);

        return (new WalletLedgerExport($rows))->download(
            'wallet-ledger-'.now()->format('Ymd-His').'.xlsx'
        );
    }

    public function exportSalesPdf(Request $request): Response
    {
        $from = $request->string('from')->toString() ?: null;
        $to = $request->string('to')->toString() ?: null;
        $overview = $this->reports->overview($from, $to);
        $rows = $this->reports->salesRows($from, $to)->take(200);

        $pdf = Pdf::loadView('reports.sales', [
            'overview' => $overview,
            'rows' => $rows,
            'appName' => config('app.name'),
        ])->setPaper('a4', 'landscape');

        return $pdf->download('sales-report-'.now()->format('Ymd-His').'.pdf');
    }
}
