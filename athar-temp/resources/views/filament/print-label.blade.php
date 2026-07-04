<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Label Athar - {{ $order->order_number }}</title>
    <style>
        @page {
            size: 105mm 148mm;
            margin: 0;
        }
        body {
            font-family: 'Inter', sans-serif;
            width: 105mm;
            height: 148mm;
            margin: 0;
            padding: 10mm;
            box-sizing: border-box;
            background: #fff;
            color: #000;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 5mm;
            margin-bottom: 5mm;
        }
        .brand {
            font-size: 24pt;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2pt;
        }
        .order-id {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 2mm;
        }
        .section {
            margin-bottom: 6mm;
        }
        .label {
            font-size: 8pt;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 1mm;
        }
        .value {
            font-size: 13pt;
            font-weight: bold;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4mm;
        }
        .items-table th, .items-table td {
            text-align: left;
            padding: 2mm 0;
            border-bottom: 1px solid #eee;
            font-size: 10pt;
        }
        .cod-box {
            margin-top: auto;
            border: 3px solid #000;
            padding: 5mm;
            text-align: center;
        }
        .cod-label {
            font-size: 10pt;
            font-weight: bold;
        }
        .cod-amount {
            font-size: 26pt;
            font-weight: 900;
        }
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">ATHAR</div>
        <div class="order-id">#{{ $order->order_number }}</div>
    </div>

    <div class="section">
        <div class="label">Destinataire</div>
        <div class="value">{{ $order->customer_name }}</div>
        <div class="value">{{ $order->customer_phone }}</div>
    </div>

    <div class="section">
        <div class="label">Ville de Livraison</div>
        <div class="value">{{ $order->customer_city }}</div>
        @if($order->customer_quartier)
            <div class="label" style="margin-top: 2mm;">Quartier</div>
            <div class="value">{{ $order->customer_quartier }}</div>
        @endif
    </div>

    <div class="section">
        <div class="label">Contenu</div>
        <table class="items-table">
            @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->variant->product->name }}</td>
                    <td style="text-align: right;">{{ $item->variant->size }} (x{{ $item->quantity }})</td>
                </tr>
            @endforeach
        </table>
    </div>

    <div class="cod-box">
        <div class="cod-label">MONTANT À PERCEVOIR (COD)</div>
        <div class="cod-amount">{{ number_format($order->total_amount, 2) }} MAD</div>
    </div>

    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>
</html>
