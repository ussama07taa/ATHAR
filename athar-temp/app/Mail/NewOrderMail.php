<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewOrderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouvelle commande Athar — ' . $this->order->order_number,
        );
    }

    public function content(): Content
    {
        $this->order->loadMissing(['items.variant.product']);

        return new Content(
            markdown: 'emails.orders.new',
            with: [
                'order' => $this->order,
                'adminUrl' => url('/admin/orders/' . $this->order->id . '/edit'),
            ],
        );
    }
}
