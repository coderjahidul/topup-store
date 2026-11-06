<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Sales Report</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #111; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        .meta { margin-bottom: 16px; color: #444; }
        .kpis td { padding: 6px 10px; border: 1px solid #ddd; }
        table.data { width: 100%; border-collapse: collapse; margin-top: 16px; }
        table.data th, table.data td { border: 1px solid #ccc; padding: 4px 6px; text-align: left; }
        table.data th { background: #f3f3f3; }
    </style>
</head>
<body>
    <h1>{{ $appName }} — Sales Report</h1>
    <div class="meta">Period: {{ $overview['from'] }} → {{ $overview['to'] }}</div>

    <table class="kpis">
        <tr>
            <td>Sales: {{ number_format($overview['sales'], 2) }}</td>
            <td>Profit: {{ number_format($overview['profit'], 2) }}</td>
            <td>Orders: {{ $overview['orders_count'] }}</td>
            <td>Paid: {{ $overview['paid_orders'] }}</td>
        </tr>
    </table>

    <table class="data">
        <thead>
            <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Game</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Flagged</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($rows as $row)
                <tr>
                    <td>{{ $row['order_number'] }}</td>
                    <td>{{ $row['date'] }}</td>
                    <td>{{ $row['game'] }}</td>
                    <td>{{ $row['customer'] }}</td>
                    <td>{{ $row['status'] }}</td>
                    <td>{{ $row['amount'] }}</td>
                    <td>{{ $row['flagged'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
