<?php

namespace App\Filament\Resources\ParfumsCategoryResource\Pages;

use App\Filament\Resources\ParfumsCategoryResource;
use Filament\Resources\Pages\EditRecord;

class EditParfumsCategory extends EditRecord
{
    protected static string $resource = ParfumsCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
