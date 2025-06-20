# Analytics Service - Clean Architecture Implementation

Este documento descreve a implementação do serviço de analytics seguindo os princípios do Clean Architecture.

## Arquitetura

### 1. Interface (Application Layer)
A interface `AnalyticsService` está definida na camada de aplicação (`src/application/use-cases/GetUserProfile.ts`):

```typescript
export interface AnalyticsService {
  track(event: string, properties: Record<string, any>): void
  setUserId(userId: string): void
  setGlobalProperties(properties: Record<string, unknown>): void
}
```

### 2. Implementações (Infrastructure Layer)
As implementações estão na camada de infraestrutura (`src/infrastructure/services/AnalyticsService.ts`):

- **ConsoleAnalyticsService**: Para desenvolvimento e testes
- **MixpanelAnalyticsService**: Para produção (exemplo)
- **AnalyticsServiceFactory**: Factory para criar instâncias

## Uso nos Use Cases

### GetUserProfile
```typescript
// Track profile access attempt
this.analyticsService.track('user_profile_access_attempt', { userId })

// Track successful profile view
this.analyticsService.track('user_profile_viewed', {
  userId: user.id,
  membershipType: user.membershipType,
  discountRate: user.getDiscountRate(),
  // ... mais propriedades
})
```

### UpdateUserProfile
```typescript
// Track update attempt
this.analyticsService.track('user_profile_update_attempt', {
  userId,
  fieldsToUpdate: { name: !!name, email: !!email }
})

// Track successful update
this.analyticsService.track('user_profile_updated', {
  userId,
  changedFields,
  previousValues,
  newValues
})
```

### ListUsers
```typescript
// Track list attempt
this.analyticsService.track('users_list_attempt', {
  filters: filters || {},
  hasFilters: !!filters
})

// Track filter results
this.analyticsService.track('users_list_filtered', {
  originalCount: allUsers.length,
  filteredCount: filteredUsers.length,
  filterEfficiency: efficiencyPercentage
})
```

### UpgradeMembership
```typescript
// Track upgrade attempt
this.analyticsService.track('membership_upgrade_attempt', {
  userId,
  targetMembershipType,
  timestamp: new Date().toISOString()
})

// Track business metrics
this.analyticsService.track('premium_conversion', {
  userId,
  conversionSource: 'manual_upgrade',
  timeToConversion: daysSinceCreation
})
```

## Uso na UI

### AnalyticsProvider
```typescript
<AnalyticsProvider userId="123" userProperties={{ plan: 'premium' }}>
  <App />
</AnalyticsProvider>
```

### AnalyticsButton
```typescript
<AnalyticsButton 
  eventName="upgrade_button_clicked"
  eventProperties={{ plan: 'premium', location: 'profile_page' }}
  onClick={handleUpgrade}
>
  Upgrade to Premium
</AnalyticsButton>
```

### useAnalytics Hook
```typescript
const { trackEvent, setUserContext } = useAnalytics()

// Track custom events
trackEvent('feature_used', { feature: 'export_data', userId: '123' })

// Set user context
setUserContext('123', { membershipType: 'premium' })
```

## Configuração no Container

```typescript
// Registrar o serviço
container.register('AnalyticsService', () => {
  return new ConsoleAnalyticsService()
})

// Registrar use cases com dependência
container.registerClass('GetUserProfile', GetUserProfile, ['UserRepository', 'AnalyticsService'])
container.registerClass('UpdateUserProfile', UpdateUserProfile, ['UserRepository', 'AnalyticsService'])
container.registerClass('ListUsers', ListUsers, ['UserRepository', 'AnalyticsService'])
container.registerClass('UpgradeMembership', UpgradeMembership, ['UserRepository', 'AnalyticsService'])
```

## Eventos Implementados

### Perfil do Usuário
- `user_profile_access_attempt`
- `user_profile_invalid_id`
- `user_profile_not_found`
- `user_profile_viewed`
- `user_premium_eligible_viewed`

### Atualização de Perfil
- `user_profile_update_attempt`
- `user_profile_update_invalid_id`
- `user_profile_update_not_found`
- `user_profile_update_email_conflict`
- `user_profile_updated`
- `user_name_updated`
- `user_email_updated`

### Listagem de Usuários
- `users_list_attempt`
- `users_list_fetched`
- `users_list_filtered`
- `users_list_completed`
- `users_list_error`

### Upgrade de Membership
- `membership_upgrade_attempt`
- `membership_upgrade_invalid_id`
- `membership_upgrade_invalid_type`
- `membership_upgrade_user_not_found`
- `membership_upgrade_already_premium`
- `membership_upgrade_not_eligible`
- `membership_upgrade_eligible_confirmed`
- `membership_upgrade_successful`
- `premium_conversion`

### UI Events
- `page_view`
- `button_click` (via AnalyticsButton)

## Benefícios da Implementação

1. **Separação de Responsabilidades**: Analytics está isolado em sua própria camada
2. **Testabilidade**: Fácil de mockar para testes
3. **Flexibilidade**: Pode trocar implementações sem afetar o código
4. **Rastreabilidade**: Eventos detalhados para análise de comportamento
5. **Clean Architecture**: Dependências fluem na direção correta
6. **Reutilização**: Mesmo serviço usado em múltiplos use cases

## Próximos Passos

1. Implementar analytics em outros use cases
2. Adicionar mais propriedades contextuais
3. Implementar analytics de performance
4. Adicionar analytics de erros
5. Implementar analytics de funil de conversão 