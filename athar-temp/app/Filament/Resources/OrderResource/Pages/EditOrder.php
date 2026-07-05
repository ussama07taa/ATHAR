<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditOrder extends EditRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('deleteDirect')
                ->label('Supprimer')
                ->icon('heroicon-o-trash')
                ->color('danger')
                ->url(fn (): string => route('orders.delete-direct', $this->record)),
        ];
    }
}
