<x-mail::message>
# Nouvelle commande {{ $order->order_number }}

**Client :** {{ $order->customer_name }}  
**Téléphone :** {{ $order->customer_phone }}  
**Ville :** {{ $order->customer_city }}  
**Quartier :** {{ $order->customer_quartier }}  
**Adresse :** {{ $order->customer_address }}

**Sous-total :** {{ number_format((float) $order->subtotal_amount, 2, ',', ' ') }} MAD
@if($order->promo_code)
**Code promo :** {{ $order->promo_code }} (−{{ number_format((float) $order->discount_amount, 2, ',', ' ') }} MAD)
@endif
**Livraison :** {{ (float) $order->shipping_amount > 0 ? number_format((float) $order->shipping_amount, 2, ',', ' ') . ' MAD' : 'Gratuite' }}

**Total :** {{ number_format((float) $order->total_amount, 2, ',', ' ') }} MAD

## Articles

@foreach($order->items as $item)
- {{ $item->variant?->product?->name ?? 'Produit' }} ({{ $item->variant?->size }}) × {{ $item->quantity }} — {{ number_format((float) $item->unit_price * $item->quantity, 2, ',', ' ') }} MAD
@endforeach

<x-mail::button :url="$adminUrl">
Voir dans l'admin
</x-mail::button>

Merci,<br>
{{ config('app.name') }}
</x-mail::message>
