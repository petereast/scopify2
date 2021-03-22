package scopify.work.backend.model

import kotlin.random.Random

enum class ScopeState {
    Proposed,
    InProgress,
    Complete
}

data class ScopeScore(
        val name: String,
        val value: Int,
        val comment: String?
)

// A scoping session to be defined
data class ScopeSession(
        val id: String,
        val title: String,
        val description: String,
        val scores: List<ScopeScore> = listOf(),
        val averageScore: Double = 0.0,
        var state: ScopeState = ScopeState.Proposed
)

interface IScopeRepository {
    fun getSession(id: String): ScopeSession?
    fun writeSession(session: ScopeSession)
}

private val charPool: List<Char> = ('a'..'z') + ('A'..'Z')
fun generateId(len: Int = 5) = (0..len)
        .map { Random.nextInt(0, charPool.size) }
        .map ( charPool::get )
        .joinToString("")