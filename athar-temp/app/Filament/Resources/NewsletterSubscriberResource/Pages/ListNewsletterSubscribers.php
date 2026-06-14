<?php

namespace App\Filament\Resources\NewsletterSubscriberResource\Pages;

use App\Filament\Resources\NewsletterSubscriberResource;
use App\Models\NewsletterSubscriber;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ListNewsletterSubscribers extends ListRecords
{
    protected static string $resource = NewsletterSubscriberResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('export')
                ->label('Exporter CSV')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(fn (): StreamedResponse => response()->streamDownload(function () {
                    $handle = fopen('php://output', 'w');
                    fputcsv($handle, ['email', 'actif', 'inscrit_le']);

                    NewsletterSubscriber::query()
                        ->orderBy('created_at')
                        ->cursor()
                        ->each(function ($sub) use ($handle) {
                            fputcsv($handle, [
                                $sub->email,
                                $sub->is_active ? 'oui' : 'non',
                                $sub->created_at?->format('Y-m-d H:i'),
                            ]);
                        });

                    fclose($handle);
                }, 'newsletter-' . now()->format('Y-m-d') . '.csv')),
        ];
    }
}
