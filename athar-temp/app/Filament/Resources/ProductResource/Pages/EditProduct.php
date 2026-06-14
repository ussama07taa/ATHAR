<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use App\Models\Category;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('preview')
                ->label('Voir sur le site')
                ->icon('heroicon-o-arrow-top-right-on-square')
                ->color('gray')
                ->url(fn (): string => $this->record->frontend_url)
                ->openUrlInNewTab(),

            Actions\Action::make('duplicate')
                ->label('Dupliquer')
                ->icon('heroicon-o-document-duplicate')
                ->action(function () {
                    $copy = ProductResource::duplicateProduct($this->record);

                    $this->redirect(ProductResource::getUrl('edit', ['record' => $copy]));
                }),

            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (empty($data['category_id'])) {
            return $data;
        }

        $category = Category::with('parent')->find($data['category_id']);

        if ($category) {
            $data['gender_id'] = $category->getGenderParentId();
        }

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        unset($data['gender_id']);

        return $data;
    }
}
